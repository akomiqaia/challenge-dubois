// import * as parse from '@fast-csv/parse';

export async function load() {
  const data = await fetch('https://raw.githubusercontent.com/ajstarks/dubois-data-portraits/master/challenge/2024/challenge01/APPLING01-coord.csv')
  const csv = await data.text()
  console.log({csv})

	return {
		
	};
}