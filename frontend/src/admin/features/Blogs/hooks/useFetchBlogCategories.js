import { blogCategoryApi } from 'admin/api';
import { tryCatch } from 'admin/utilities';
import { useEffect, useState } from 'react';

export const useFetchBlogCategories = (props) => {
	const { defaultValues = [] } = props || {};
	const [blogCategories, setBlogCategories] = useState(() => defaultValues);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await blogCategoryApi.getFlattenAll();
			setBlogCategories(metadata);
		})();
	}, []);

	return [blogCategories, setBlogCategories];
};
