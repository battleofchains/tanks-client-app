import { Tank } from '../models';
import { BlackPaper, StyledAppBox } from './StyledUIGridBlocks';
import React from 'react';
import { styled } from '@mui/material';
// @ts-ignore
const appUrl = APP_URL;

const InfoWrapper = styled('div')({});

const TankEntryWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
});
const Bonuses = styled(StyledAppBox)({
	padding: '0 25px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const NameWrapper = styled(BlackPaper)({
	fontSize: 30,
	fontWeight: 'bold',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginBottom: 15,
});

const TankMenuImage = styled('img')({
	maxWidth: '100%',
});
type TankSelectorEntryProps = {
	tank: Tank;
};
const TankSelectorEntry: React.FC<TankSelectorEntryProps> = ({ tank }) => {
	return (
		<TankEntryWrapper>
			<TankMenuImage
				src={`${appUrl}${tank.menu_image}`}
				alt={tank.name}
			/>
			<InfoWrapper>
				<NameWrapper>
					<img
						src={`${appUrl}${tank.country.image}`}
						alt={tank.country.name}
					/>
					&nbsp;&nbsp;&nbsp;{tank.name}&nbsp;&nbsp;&nbsp;
					<img
						src={`${appUrl}${tank.type.image}`}
						alt={tank.type.name}
					/>
				</NameWrapper>
				<Bonuses>
					<img src="https://static.ubex.com/tanks.app/assets/gui/level_tank_star.png" />
					<img src="https://static.ubex.com/tanks.app/assets/gui/hp.png" />
					<img src="https://static.ubex.com/tanks.app/assets/gui/ammunition_1.png" />
					<img src="https://static.ubex.com/tanks.app/assets/gui/ammunition_2.png" />
				</Bonuses>
			</InfoWrapper>
		</TankEntryWrapper>
	);
};

export default TankSelectorEntry;
