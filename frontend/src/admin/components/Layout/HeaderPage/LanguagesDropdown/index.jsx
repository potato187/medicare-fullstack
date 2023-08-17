import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from '@/shared/components';
import { useLanguages } from '@/store';
import cn from 'classnames';
import { Button } from '@/admin/components';
import module from './style.module.scss';

export function LanguagesDropdown({ list = [] }) {
	const { 'dropdown-list': listCln, item: itemCln } = module;
	const { languageId, changeLanguageById } = useLanguages();
	const currentLanguage = list.find((language) => language.languageId === languageId);

	return (
		<BaseDropdown>
			<DropdownHeader>
				<Button switched square rounded fade>
					<img width={18} height={18} src={currentLanguage.image} alt={currentLanguage.name} className='rounded-1' />
				</Button>
			</DropdownHeader>
			<DropdownBody variant='right' className={listCln}>
				{list.map(({ name, image, languageId: id }) => (
					<DropdownItem
						type='button'
						key={id}
						className={cn(itemCln, { active: id === languageId })}
						customOnClick={() => changeLanguageById(id)}>
						<img className='rounded-1' width={16} height={16} src={image} alt={name} />
						<span>{name}</span>
					</DropdownItem>
				))}
			</DropdownBody>
		</BaseDropdown>
	);
}
