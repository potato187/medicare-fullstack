export const convertData = (input) => {
	const output = {};

	const buildOutput = (inputObj, breadcrumb = []) => {
		Object.entries(inputObj).forEach(([key, value]) => {
			const currentBreadcrumb = [...breadcrumb, key];
			const currentKey = currentBreadcrumb.join('.');

			if (typeof value === 'object') {
				if (value !== null) {
					buildOutput(value, currentBreadcrumb);
				} else {
					output[currentKey] = null;
				}
			} else {
				output[currentKey] = value;
			}
		});
	};

	buildOutput(input);

	const result = {};
	Object.entries(output).forEach(([key, value]) => {
		const parts = key.split('.');
		const last = parts.pop();
		const newKey = parts.join('.');
		const breadcrumb = parts.slice();

		if (!result[newKey]) {
			result[newKey] = {
				breadcrumb,
				fields: {},
			};
		}

		result[newKey].fields[last] = value;
	});

	return result;
};

export const convertName = (name) => {
	const [first, ...rest] = name.split('_');
	return [first, ...rest]
		.map((word) => {
			return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
		})
		.join(' ');
};
