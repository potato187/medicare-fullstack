import cn from 'classnames';
import { IMPORT_STATUS } from 'constant';
import module from './style.module.scss';

export function TrStatus({ status = 'prepare', className = '', children }) {
	const { 'tr-status': tdStatusCln, prepare: prepareCln, success: successCln, fail: failCln } = module;
	const style = cn(
		tdStatusCln,
		{
			[prepareCln]: status === IMPORT_STATUS.PREPARE,
			[successCln]: status === IMPORT_STATUS.SUCCESS,
			[failCln]: status === IMPORT_STATUS.FAIL,
		},
		className,
	);

	return <tr className={style}>{children}</tr>;
}
