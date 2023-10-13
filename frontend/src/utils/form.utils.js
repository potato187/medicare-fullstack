export const buildFormData = (formData, data, parentKey) => {
	if (
		data &&
		typeof data === 'object' &&
		!(data instanceof Date) &&
		!(data instanceof File) &&
		!(data instanceof Blob)
	) {
		Object.keys(data).forEach((key) => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
		});
	} else {
		const value = data == null ? '' : data;
		formData.append(parentKey, value);
	}
};

export const setDefaultValues = (methods = null, defaultValues = {}) => {
	if (!methods || !Object.keys(defaultValues).length) return;
	Object.entries(defaultValues).forEach(([key, value]) => {
		methods.setValue(key, value);
	});
};
