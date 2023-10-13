import cn from 'classnames';
import { useState } from 'react';
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from 'react-icons/ti';
import { FormattedMessage } from 'react-intl';
import { ORDER_ASCENDING as ASC, ORDER_DESCENDING as DESC, ORDER_NONE } from 'constant';
import module from './style.module.scss';

const getIconDirection = (order) => {
	switch (order) {
		case ASC:
			return <TiArrowSortedUp size='0.875em' />;
		case DESC:
			return <TiArrowSortedDown size='0.875em' />;
		default:
			return <TiArrowUnsorted size='0.875em' />;
	}
};

export function SortableTableHeader({ name = '', intl, className = '', orders = [], onChange = (f) => f, ...props }) {
	const [order, setOrder] = useState(() => {
		const temp = Array.isArray(orders) ? orders.find((order) => order.includes(name)) : orders;
		return temp ? temp.split(',')[1] : ORDER_NONE;
	});

	const {
		'sort-column': sortColumnCln,
		'sort-column__title': titleCln,
		'sort-column__icon': iconCln,
		active: activeCln,
	} = module;

	const classNames = cn({
		[sortColumnCln]: true,
		[activeCln]: order !== ORDER_NONE,
		[className]: className,
	});
	const IconDirection = getIconDirection(order);
	const handleOnClick = () => {
		const newOrder = order === ASC ? DESC : order === DESC ? ORDER_NONE : ASC;
		setOrder(newOrder);
		onChange(name, newOrder);
	};

	return (
		<th onClick={handleOnClick} {...props}>
			<div className={classNames}>
				<span className={titleCln}>
					<FormattedMessage id={intl} />
				</span>
				<span className={iconCln}>{IconDirection}</span>
			</div>
		</th>
	);
}
