export function getHexColorFromString(input: string): number {
	const colors = [0xe51c23, 0x673ab7, 0x03a9f4, 0x259b24, 0xff5722];
	// @ts-ignore
	return getColorFromString(input, colors);
}
export function getStringColorFromString(input: string): string {
	const colors = ['#e51c23', '#673ab7', '#03a9f4', '#259b24', '#ff5722'];
	// @ts-ignore
	return getColorFromString(input, colors);
}
function getColorFromString(
	input: string,
	colors: string[] | number[],
): number | string {
	let hash = 0;
	if (input.length === 0) return hash;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}
	hash = ((hash % colors.length) + colors.length) % colors.length;
	return colors[hash];
}
