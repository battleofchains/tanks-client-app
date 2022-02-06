import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tank } from '../models';

export default ({ tank }: any) => {
	// @ts-ignore
	return <img src={`${APP_URL}${tank.image}`} style={{ maxWidth: '100%' }} />;
};
