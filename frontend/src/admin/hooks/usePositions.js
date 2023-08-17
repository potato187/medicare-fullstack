import { formatDataForSelect } from '../utilities';
import { useQuery } from './useQuery';

export const usePositions = ({ languageId }) => {
	const { Positions } = useQuery(
		'Positions',
		{
			from: 'Position',
			attributes: [['positionId', 'id'], 'value_vi', 'value_en'],
			order: [['positionId', 'asc']],
			search_by: 'positionId',
			search: 'AD',
		},
		formatDataForSelect(languageId),
	);

	return Positions;
};
