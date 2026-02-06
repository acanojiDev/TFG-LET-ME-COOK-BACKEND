
import { GraphQLScalarType, Kind } from 'graphql';

export const resolvers = {
	DateTime: new GraphQLScalarType({
		name: 'DateTime',
		description: 'Date custom scalar type',
		serialize(value: any) {
			// value sent to the client
			return value instanceof Date ? value.toISOString() : value;
		},
		parseValue(value: any) {
			// value from the client
			return new Date(value);
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.STRING) {
				return new Date(ast.value);
			}
			return null;
		},
	}),
	Decimal: new GraphQLScalarType({
		name: 'Decimal',
		description: 'Decimal custom scalar type',
		serialize(value: any) {
			return value;
		},
		parseValue(value: any) {
			return value;
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.STRING || ast.kind === Kind.FLOAT || ast.kind === Kind.INT) {
				return ast.value;
			}
			return null;
		},
	}),
};
