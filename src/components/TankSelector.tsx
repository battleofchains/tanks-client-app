import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { RootState } from '../store';
import { Tank } from '../models';
import Options from './Options';
import GameMenu from './GameMenu';
import TankSelectorEntry from './TankSelectorEntry';
import {
	TankSelectorWrapper,
	TankSelectorHeader,
	TankSelectorFooter,
	GameModeWrapper,
	MoneyButton,
	TanksScrollerWrapper,
	TanksScroller,
	ScrollerArrowLeft,
	ScrollerArrowRight,
	TanksScrollerEntry,
	ToBattleButton,
} from './TankSelectorStyles';
// @ts-ignore
const appUrl = APP_URL;

const TankSelector = () => {
	const dispatch = useDispatch();
	const swiper = useSwiper();
	const { playerTanks } = useSelector((state: RootState) => state.players);
	const { battleTankNumber } = useSelector(
		(state: RootState) => state.battle,
	);
	const [selectedTanks, setSelectedTanks] = React.useState([]);

	React.useEffect(() => {
		const defaultSelected = playerTanks.slice(0, battleTankNumber);
		setSelectedTanks(defaultSelected);
		// console.log('selectedTanks', JSON.stringify(defaultSelected));
	}, [playerTanks]);

	const handleSelectTank = (tank: Tank) => {
		const isSelected = selectedTanks.find((t: Tank) => t.id === tank.id);
		if (isSelected) {
			setSelectedTanks(
				selectedTanks.filter((t: Tank) => t.id !== tank.id),
			);
		} else if (selectedTanks.length < battleTankNumber) {
			setSelectedTanks([...selectedTanks, tank]);
		}
	};

	const readyToBattle = selectedTanks.length === battleTankNumber;
	const handleSubmitSelectedTanks = () => {
		// todo: при повторной битве эвент не отправляется на сервер
		if (readyToBattle) {
			dispatch({
				type: 'socket',
				payload: { tanks: selectedTanks },
				meta: { event: 'select_tanks' },
			});
		}
	};

	const handleScrollControl = (direction: 0 | 1) => {
		console.log(swiper);
		if (direction) {
			swiper.slideNext();
		} else {
			swiper.slidePrev();
		}
	};

	if (!playerTanks.length) {
		return null;
	}

	return (
		<TankSelectorWrapper>
			<TankSelectorHeader>
				<GameMenu />
				<GameModeWrapper>
					Game mode &nbsp;
					<img src="https://static.ubex.com/tanks.app/assets/gui/button_game_mode_star.png" />
					&nbsp;
					<img src="https://static.ubex.com/tanks.app/assets/gui/button_game_mode_2vs2.png" />
				</GameModeWrapper>
				<div style={{ display: 'flex' }}>
					<MoneyButton>
						<img src="https://static.ubex.com/tanks.app/assets/gui/money.png" />
						&nbsp;100 500&nbsp;
						<img src="https://static.ubex.com/tanks.app/assets/gui/plus.png" />
					</MoneyButton>
					<Options />
				</div>
			</TankSelectorHeader>
			<div>
				<Swiper navigation modules={[Navigation]} slidesPerView={3}>
					{playerTanks.map((tank: Tank) => {
						return (
							<SwiperSlide
								key={tank.id}
								onClick={() => handleSelectTank(tank)}
							>
								<TankSelectorEntry tank={tank} />
							</SwiperSlide>
						);
					})}
				</Swiper>
			</div>
			<TankSelectorFooter>
				<TanksScrollerWrapper>
					<TanksScroller>
						{playerTanks.map((tank: Tank) => {
							const isSelected = selectedTanks.find(
								(t: Tank) => t.id === tank.id,
							);
							return (
								<TanksScrollerEntry
									key={tank.id}
									onClick={() => handleSelectTank(tank)}
									style={{
										backgroundImage: `url(${appUrl}${tank.image})`,
										borderColor: isSelected
											? 'red'
											: '#461415',
									}}
								/>
							);
						})}
					</TanksScroller>
					<ScrollerArrowLeft onClick={() => handleScrollControl(0)} />
					<ScrollerArrowRight
						onClick={() => handleScrollControl(1)}
					/>
				</TanksScrollerWrapper>
				<ToBattleButton
					style={{ opacity: readyToBattle ? 1 : 0.5 }}
					onClick={() => handleSubmitSelectedTanks()}
				>
					To battle!
				</ToBattleButton>
			</TankSelectorFooter>
		</TankSelectorWrapper>
	);
};

export default TankSelector;
