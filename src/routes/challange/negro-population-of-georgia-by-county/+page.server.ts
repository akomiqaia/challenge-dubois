import geoJson from '../../../data/challenge01/geojson.json';
import data1870 from '../../../data/challenge01/data1870.json';
import data1880 from '../../../data/challenge01/data1880.json';

export async function load() {

	return {
		geoJson,
		data1870,
		data1880
	};
}
