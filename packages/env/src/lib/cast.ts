import { toArray, toBoolean } from '@directus/utils';
import { toNumber, toString } from 'lodash-es';
import { getTypeFromMap } from '../utils/get-type-from-map.js';
import { guessType } from '../utils/guess-type.js';
import { getCastFlag } from '../utils/has-cast-prefix.js';
import { tryJson } from '../utils/try-json.js';

export const cast = (value: unknown, key?: string): unknown => {
	const castFlag = getCastFlag(value);
	const type = castFlag ?? getTypeFromMap(key) ?? guessType(value);

	if (typeof value === 'string' && castFlag) {
		value = value.substring(castFlag.length + 1); // Type length + 1 for `:` character
	}

	switch (type) {
		case 'string':
			return toString(value);
		case 'number':
			return toNumber(value);
		case 'boolean':
			return toBoolean(value);
		case 'regex':
			return new RegExp(String(value));
		case 'array':
			return toArray(value).map((v) => cast(v));
		case 'json':
			return tryJson(value);
	}
};
