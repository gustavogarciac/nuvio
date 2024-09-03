import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { Doc, Id } from './_generated/dataModel'
import { mutation, query, QueryCtx } from './_generated/server'
import { auth } from './auth'

const populateReactions = (ctx: QueryCtx, messageId: Id<'messages'>) => {
  return ctx.db
    .query('reactions')
    .withIndex('by_message_id', (q) => q.eq('messageId', messageId))
    .collect()
}

const populateThread = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const messages = await ctx.db
    .query('messages')
    .withIndex('by_parent_message_id', (q) =>
      q.eq('parentMessageId', messageId),
    )
    .collect()

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: '',
    }
  }

  const lastMessage = messages[messages.length - 1]
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId)

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: '',
    }
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name || '',
  }
}

const populateUser = (ctx: QueryCtx, userId: Id<'users'>) => {
  return ctx.db.get(userId)
}

const populateMember = async (ctx: QueryCtx, memberId: Id<'members'>) => {
  return ctx.db.get(memberId)
}

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<'workspaces'>,
  userId: Id<'users'>,
) => {
  return ctx.db
    .query('members')
    .withIndex('by_workspace_id_user_id', (q) =>
      q.eq('workspaceId', workspaceId).eq('userId', userId),
    )
    .unique()
}

export const get = query({
  args: {
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    parentMessageId: v.optional(v.id('messages')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) throw new Error('Unauthorized')

    let _conversationId = args.conversationId

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId)

      if (!parentMessage) {
        throw new Error('Parent message not found')
      }

      _conversationId = parentMessage.conversationId
    }

    const results = await ctx.db
      .query('messages')
      .withIndex('by_channel_id_parent_message_id_conversation_id', (q) =>
        q
          .eq('channelId', args.channelId)
          .eq('parentMessageId', args.parentMessageId)
          .eq('conversationId', _conversationId),
      )
      .order('desc')
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId)
            const user = member ? await populateUser(ctx, member.userId) : null

            if (!member || !user) {
              return null
            }

            const reactions = await populateReactions(ctx, message._id)
            const thread = await populateThread(ctx, message._id)
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined

            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              }
            })

            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value,
                )

                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId]),
                  )
                } else {
                  acc.push({
                    ...reaction,
                    memberIds: [reaction.memberId],
                  })
                }

                return acc
              },
              [] as (Doc<'reactions'> & {
                count: number
                memberIds: Id<'members'>[]
              })[],
            )

            const reactionsWithoutMemberIdProperty = dedupedReactions.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ memberId, ...rest }) => {
                return {
                  ...rest,
                }
              },
            )

            return {
              ...message,
              member,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timestamp,
              image,
            }
          }),
        )
      ).filter((message) => message !== null),
    }
  },
})

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id('_storage')),
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    parentMessageId: v.optional(v.id('messages')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) throw new Error('Unauthorized')

    const member = await getMember(ctx, args.workspaceId, userId)

    if (!member) throw new Error('Unauthorized')

    let _conversationId = args.conversationId

    // Only possible if we are replying in a thread in 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId)

      if (!parentMessage) {
        throw new Error('Parent message not found')
      }

      _conversationId = parentMessage.conversationId
    }

    const messageId = await ctx.db.insert('messages', {
      memberId: member._id,
      body: args.body,
      image: args.image,
      workspaceId: args.workspaceId,
      conversationId: _conversationId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
    })

    return { messageId }
  },
})

export const update = mutation({
  args: {
    id: v.id('messages'),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) throw new Error('Unauthorized')

    const message = await ctx.db.get(args.id)

    if (!message) {
      throw new Error('Message not found')
    }

    const member = await getMember(ctx, message.workspaceId, userId)

    if (!member || member._id !== message.memberId)
      throw new Error('Unauthorized')

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    })

    return { messageId: args.id }
  },
})

export const remove = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) throw new Error('Unauthorized')

    const message = await ctx.db.get(args.id)

    if (!message) {
      throw new Error('Message not found')
    }

    const member = await getMember(ctx, message.workspaceId, userId)

    if (!member || member._id !== message.memberId)
      throw new Error('Unauthorized')

    await ctx.db.delete(args.id)

    return { messageId: args.id }
  },
})

export const getById = query({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) return null

    const message = await ctx.db.get(args.id)

    if (!message) {
      return null
    }

    const currentMember = await getMember(ctx, message.workspaceId, userId)

    if (!currentMember) return null

    const member = await populateMember(ctx, message.memberId)

    if (!member) return null

    const user = await populateUser(ctx, member.userId)

    if (!user) return null

    const reactions = await populateReactions(ctx, message._id)

    const reactionsWithCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length,
      }
    })

    const dedupedReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find((r) => r.value === reaction.value)

        if (existingReaction) {
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId]),
          )
        } else {
          acc.push({
            ...reaction,
            memberIds: [reaction.memberId],
          })
        }

        return acc
      },
      [] as (Doc<'reactions'> & {
        count: number
        memberIds: Id<'members'>[]
      })[],
    )

    const reactionsWithoutMemberIdProperty = dedupedReactions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ memberId, ...rest }) => {
        return {
          ...rest,
        }
      },
    )

    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      user,
      member,
      reactions: reactionsWithoutMemberIdProperty,
    }
  },
})
