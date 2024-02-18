export async function load({url}) {
  const res = await fetch(`${url.origin}/challenge01/geojson.json`)
  const geoJson = await res.json()
	return {
		geoJson
	};
}
