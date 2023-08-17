import { formatDataForSelect } from '../utilities';
import { useQuery } from './useQuery';

export const useGenders = ({ languageId }) => {
	const { Genders } = useQuery(
		'Genders',
		{
			from: 'Gender',
			attributes: [['genderId', 'id'], 'value_vi', 'value_en'],
			order: [['genderId', 'asc']],
		},
		formatDataForSelect(languageId),
	);

	return Genders;
};
