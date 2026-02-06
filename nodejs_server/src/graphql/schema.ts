
import { typeDefs as commonTypeDefs } from '../modules/common/graphql/typeDefs';
import { resolvers as commonResolvers } from '../modules/common/graphql/resolvers';

import { typeDefs as userTypeDefs } from '../modules/user/graphql/typeDefs';
import { resolvers as userResolvers } from '../modules/user/graphql/resolvers';

import { typeDefs as postTypeDefs } from '../modules/posts/graphql/typeDefs';
import { resolvers as postResolvers } from '../modules/posts/graphql/resolvers';

import { typeDefs as storyTypeDefs } from '../modules/stories/graphql/typeDefs';
import { resolvers as storyResolvers } from '../modules/stories/graphql/resolvers';

import { typeDefs as placeTypeDefs } from '../modules/place/graphql/typeDefs';
import { resolvers as placeResolvers } from '../modules/place/graphql/resolvers';

import { Context } from './context';

export const typeDefs = [
	commonTypeDefs,
	userTypeDefs,
	postTypeDefs,
	storyTypeDefs,
	placeTypeDefs
];

export const resolvers = [
	commonResolvers,
	userResolvers,
	postResolvers,
	storyResolvers,
	placeResolvers
];
