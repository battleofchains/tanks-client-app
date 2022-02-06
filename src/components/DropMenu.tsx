import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';

const btnSize = 86;
const DropMenuContainer = styled(Box)({
	position: 'relative',
	marginLeft: 15,
});

const DropMenuActiveEntry = styled('div')({
	position: 'relative',
	width: btnSize,
	height: btnSize,
	zIndex: 10,
	background: 'center no-repeat',
});

const DropMenuEntryNumber = styled('div')({
	color: '#fff',
	border: '#461415',
	width: '27px',
	height: '27px',
	backgroundColor: '#d51e23',
	position: 'absolute',
	top: '5px',
	right: '-10px',
	borderRadius: 100,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const DropMenuExpanded = styled('div')({
	position: 'absolute',
	zIndex: 5,
	bottom: 5,
	paddingBottom: btnSize - 6,
	backgroundColor: '#aeb2be',
	border: '2px solid',
	width: btnSize - 4,
	borderColor: '#461415',
	'& > .hr': {
		height: '3px',
		borderRadius: '10px',
		backgroundColor: '#7c8089',
	},
	borderRadius: '10px',
});

const DropMenuExpandedEntry = styled('div')({
	position: 'relative',
	'& > img': {},
});

type DropMenuDataEntry = {
	alias: string;
	number: number;
	icon: string;
};

type DropMenuProps = {
	btnData: DropMenuDataEntry;
	entries: DropMenuDataEntry[];
};

const DropMenu: React.FC<DropMenuProps> = ({ btnData, entries }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	if (!entries || !entries.length) {
		return null;
	}
	return (
		<DropMenuContainer>
			<DropMenuActiveEntry
				style={{
					backgroundImage: isOpen
						? 'url(https://static.ubex.com/tanks.app/assets/gui/button_press.png)'
						: 'url(https://static.ubex.com/tanks.app/assets/gui/button.png)',
				}}
				onClick={() => setIsOpen(!isOpen)}
			>
				<img src={btnData.icon} alt={btnData.alias} />
				{btnData.number > 0 && (
					<DropMenuEntryNumber>{btnData.number}</DropMenuEntryNumber>
				)}
			</DropMenuActiveEntry>
			{isOpen && entries.length > 1 && (
				<DropMenuExpanded>
					{entries.map((entry, index) => (
						<DropMenuExpandedEntry>
							<img src={entry.icon} alt={entry.alias} />
							{index === entries.length - 1 && (
								<div className="hr" />
							)}
							{entry.number > 0 && (
								<DropMenuEntryNumber>
									{entry.number}
								</DropMenuEntryNumber>
							)}
						</DropMenuExpandedEntry>
					))}
				</DropMenuExpanded>
			)}
		</DropMenuContainer>
	);
};

export default DropMenu;
