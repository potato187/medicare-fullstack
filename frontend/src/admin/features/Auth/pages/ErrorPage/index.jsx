import { Container, TextShadow } from 'components';
import { PATH_IMAGES } from 'constant';
import { FormattedMessage } from 'react-intl';
import { Layout } from '../../components';

export default function ErrorPage() {
	return (
		<Layout>
			<Container transparent>
				<div className='row'>
					<div className='col-12 text-center'>
						<TextShadow className='fw-bold'>
							<FormattedMessage id='common.maintenance.title' />
						</TextShadow>
						<p className='fs-14 text-white-50'>
							<FormattedMessage id='common.maintenance.message' />
						</p>
					</div>
					<div className='col-xl-4 col-lg-8 offset-xl-4 offset-lg-2'>
						<img src={PATH_IMAGES.BANNER_MAINTENANCE} alt='' className='img-fluid' />
					</div>
				</div>
			</Container>
		</Layout>
	);
}
