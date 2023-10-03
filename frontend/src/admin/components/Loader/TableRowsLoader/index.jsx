/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
import { Skeleton } from '../Skeleton';

export function TableRowsLoader({ rows = 10, columns = 6 }) {
	return [...Array(rows)].map((row, index) => (
		<tr key={index}>
			{[...Array(columns)].map((_, index) => (
				<td key={index}>
					<Skeleton />
				</td>
			))}
		</tr>
	));
}
