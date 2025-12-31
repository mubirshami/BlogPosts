import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .refine(
      (content) => {
        // Remove HTML tags and check text length
        const textContent = content.replace(/<[^>]*>/g, '').trim();
        return textContent.length >= 10;
      },
      {
        message: 'Content must be at least 10 characters (excluding HTML tags)',
      }
    ),
});

