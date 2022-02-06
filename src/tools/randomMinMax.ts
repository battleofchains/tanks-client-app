export default function (min: number = 1, max: number = 1) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
