export const compose = (...fns) => {
	return (arg) => {
		fns.forEach((fn) => {
			if (fn) {
				fn(arg);
			}
		});
	};
};
