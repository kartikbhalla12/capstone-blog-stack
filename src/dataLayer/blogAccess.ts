import * as AWS from 'aws-sdk';
import { createLogger } from '@utils/logger';
import { BlogItem } from './../models/blogItem';
import BlogShort from './../models/blogShort';

const logger = createLogger('blog');

export class BlogAccess {
	constructor(
		private readonly docClient = BlogAccess.createDynamoDBClient(),
		private readonly blogsTable = process.env.BLOGS_TABLE,
		private readonly blogsIdIndex = process.env.BLOGS_ID_INDEX
	) {}

	async getBlogs(userId: string): Promise<BlogShort[]> {
		logger.info('Getting All Blogs');
		const result = await this.docClient
			.scan({
				TableName: this.blogsTable,
				IndexName: this.blogsIdIndex,
				FilterExpression: 'userId <> :userId', // Not equal to userId
				ExpressionAttributeValues: {
					':userId': userId,
				},
				ProjectionExpression:
					'blogId, authorName, heading, description, imageUrl, timeToRead',
			})
			.promise();

		return result.Items as BlogShort[];
	}

	async getUserBlogs(userId: string): Promise<BlogShort[]> {
		logger.info('Getting User Blogs');
		const result = await this.docClient
			.query({
				TableName: this.blogsTable,
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': userId,
				},
				ScanIndexForward: false,
				ProjectionExpression:
					'blogId, authorName, heading, description, imageUrl, timeToRead',
			})
			.promise();

		return result.Items as BlogShort[];
	}
	async createBlog(blogItem: BlogItem): Promise<BlogItem> {
		logger.info('Creating a blog with id: ', blogItem.blogId);

		await this.docClient
			.put({
				TableName: this.blogsTable,
				Item: blogItem,
			})
			.promise();

		return blogItem;
	}

	async deleteUserBlog(blogId: string, userId: string): Promise<BlogItem> {
		logger.info('Deleting a blog with id: ', blogId);

		const result = await this.docClient
			.delete({
				TableName: this.blogsTable,
				Key: { blogId, userId },
				ReturnValues: 'ALL_OLD',
			})
			.promise();

		return result.Attributes as BlogItem;
	}

	async updateUserBlog(
		userId: string,
		blogId: string,
		blogRequest: BlogRequest
	): Promise<BlogItem> {
		logger.info('Updating a blog with id: ', blogId);
		const result = await this.docClient
			.update({
				TableName: this.blogsTable,
				Key: { blogId, userId },
				UpdateExpression:
					'set heading = :heading, description = :description, updatedAt = :updatedAt, content = :content, timeToRead = :timeToRead, authorName = :authorName',
				ExpressionAttributeValues: {
					':heading': blogRequest.heading,
					':description': blogRequest.description,
					':updatedAt': new Date().toISOString(),
					':content': blogRequest.content,
					':timeToRead': blogRequest.timeToRead,
					':authorName': blogRequest.authorName,
				},
				ReturnValues: 'ALL_NEW',
			})
			.promise();

		return result.Attributes as BlogItem;
	}

	static createDynamoDBClient() {
		if (process.env.IS_OFFLINE) {
			logger.info('Running DynamoDB locally!');

			return new AWS.DynamoDB.DocumentClient({
				region: 'localhost',
				endpoint: 'http://localhost:8000',
			});
		}

		return new AWS.DynamoDB.DocumentClient();
	}
}
