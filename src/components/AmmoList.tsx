import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles, styled } from '@mui/styles';
import theme from '../theme';
const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
	},
	schema: {
		height: 64,
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

const AmmoItem = styled('div')((theme?: any) => ({}));

export default function AmmoList() {
	const [activeAmmo, setActiveAmmo] = useState(0);
	const ammunition = [
		{ name: 'фугас', amount: 10 },
		{ name: 'бронебойный', amount: 10 },
		{ name: 'подколибер', amount: 100 },
	];
	const classes = useStyles();
	return (
		<>
			<img src={'images/schema.png'} className={classes.schema} />
			<Grid container spacing={0}>
				{ammunition.map((ammo, index) => {
					const current = index === activeAmmo;
					return (
						<Grid
							key={ammo.name}
							item
							xs={4}
							onClick={() => setActiveAmmo(index)}
						>
							<AmmoItem>
								<div>
									{ammo.name}
									{current && 'X'}
								</div>
								<div>{ammo.amount}</div>
							</AmmoItem>
						</Grid>
					);
				})}
			</Grid>
		</>
	);
}
