import { Injectable } from '@nestjs/common';
import * as proj4 from 'proj4';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CoordsService {
  constructor() {
    this._buffer = fs.readFileSync(
      path.join(__dirname, './OSTN15_NTv2_OSGBtoETRS.gsb'),
    ).buffer;
    proj4.nadgrid('OSTN15_NTv2_OSGBtoETRS', this._buffer);
    proj4.defs(
      'OSTN15',
      '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=OSTN15_NTv2_OSGBtoETRS',
    );
    proj4.defs(
      'OSGB36',
      '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
    );
    proj4.defs(
      'ETRS89',
      '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
    );
    proj4.defs('WGS84', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
  }

  _buffer: ArrayBufferLike = null;

  /**
   * Extent of the UK
   */
  _maxBounds = {
    projected: [
      [0.0, 0.0],
      [699999.9, 1299999.9],
    ],
    geographic: [
      [-8.74, 49.84],
      [1.96, 60.9],
    ],
  };

  /**
   * Test whether coordinates are within the permitted bounds.
   * @param {object} coordinates - The easting + northing or latlng to be validated.
   */
  checkBounds(coordinates: any): boolean {
    var isValid = true;
    if (coordinates.hasOwnProperty('ea') && coordinates.hasOwnProperty('no')) {
      if (
        coordinates.ea < this._maxBounds.projected[0][0] ||
        coordinates.ea > this._maxBounds.projected[1][0] ||
        coordinates.no < this._maxBounds.projected[0][1] ||
        coordinates.no > this._maxBounds.projected[1][1]
      ) {
        isValid = false;
      }
    } else if (
      coordinates.hasOwnProperty('lat') &&
      coordinates.hasOwnProperty('lng')
    ) {
      if (
        coordinates.lng < this._maxBounds.geographic[0][0] ||
        coordinates.lng > this._maxBounds.geographic[1][0] ||
        coordinates.lat < this._maxBounds.geographic[0][1] ||
        coordinates.lat > this._maxBounds.geographic[1][1]
      ) {
        isValid = false;
      }
    }
    return isValid;
  }

  /**
   * Test whether a standard grid reference with a valid format has been provided.
   * param {string} gridref - The grid reference to be validated.
   */
  _validateGridRef(gridref: string): boolean {
    var regex: RegExp = /^[THJONS][VWXYZQRSTULMNOPFGHJKABCDE] ?[0-9]{1,5} ?[0-9]{1,5}$/;
    var match = Array.isArray(gridref.toUpperCase().match(regex))
      ? true
      : false;

    var isValid =
      gridref.replaceAll(' ', '').length % 2 === 0 && match ? true : false;

    return isValid;
  }

  /**
   * Return grid reference [plain | encoded | components] from an input easting + northing.
   * @param {object} coordinates - The easting + northing to be converted.
   */
  toGridRef(coordinates: any): string {
    var test = this.checkBounds(coordinates);
    if (!test) {
      return '';
    }

    var prefixes = [
      ['SV', 'SW', 'SX', 'SY', 'SZ', 'TV', 'TW'],
      ['SQ', 'SR', 'SS', 'ST', 'SU', 'TQ', 'TR'],
      ['SL', 'SM', 'SN', 'SO', 'SP', 'TL', 'TM'],
      ['SF', 'SG', 'SH', 'SJ', 'SK', 'TF', 'TG'],
      ['SA', 'SB', 'SC', 'SD', 'SE', 'TA', 'TB'],
      ['NV', 'NW', 'NX', 'NY', 'NZ', 'OV', 'OW'],
      ['NQ', 'NR', 'NS', 'NT', 'NU', 'OQ', 'OR'],
      ['NL', 'NM', 'NN', 'NO', 'NP', 'OL', 'OM'],
      ['NF', 'NG', 'NH', 'NJ', 'NK', 'OF', 'OG'],
      ['NA', 'NB', 'NC', 'ND', 'NE', 'OA', 'OB'],
      ['HV', 'HW', 'HX', 'HY', 'HZ', 'JV', 'JW'],
      ['HQ', 'HR', 'HS', 'HT', 'HU', 'JQ', 'JR'],
      ['HL', 'HM', 'HN', 'HO', 'HP', 'JL', 'JM'],
    ];

    var x = Math.floor(coordinates.ea / 100000);
    var y = Math.floor(coordinates.no / 100000);

    var prefix = prefixes[y][x];

    var e1 = Math.floor(coordinates.ea % 100000); // Math.round(coordinates.ea % 100000);
    var n1 = Math.floor(coordinates.no % 100000); // Math.round(coordinates.no % 100000);

    var e = String(e1).padStart(5, '0');
    var n = String(n1).padStart(5, '0');

    var text = prefix + ' ' + e + ' ' + n;

    return text;
  }

  /**
   * Return easting + northing from an input grid reference.
   * @param {string} gridref - The grid reference to be converted.
   */
  fromGridRef(gridref: string): object {
    gridref = String(gridref).trim();

    var test = this._validateGridRef(gridref);
    if (!test) {
      return {};
    }

    var gridLetters = 'VWXYZQRSTULMNOPFGHJKABCDE';

    var ref = gridref.toUpperCase().replaceAll(' ', '');

    var majorEasting = (gridLetters.indexOf(ref[0]) % 5) * 500000 - 1000000;
    var majorNorthing =
      Math.floor(gridLetters.indexOf(ref[0]) / 5) * 500000 - 500000;

    var minorEasting = (gridLetters.indexOf(ref[1]) % 5) * 100000;
    var minorNorthing = Math.floor(gridLetters.indexOf(ref[1]) / 5) * 100000;

    var i = (ref.length - 2) / 2;
    var m = Math.pow(10, 5 - i);

    var e = majorEasting + minorEasting + parseInt(ref.substr(2, i)) * m;
    var n = majorNorthing + minorNorthing + parseInt(ref.substr(i + 2, i)) * m;

    return { ea: e, no: n };
  }

  /**
   * Return easting + northing from an input latlng.
   * @param {object} coordinates - The latlng to be transformed.
   * @param {integer} decimals - [optional] The specified number of decimal places.
   */
  WGStoOSGB(coordinates: any, decimals: number = 2): object {
    var test = this.checkBounds(coordinates);
    if (!test) {
      return {};
    }
    var point = proj4('WGS84', 'OSGB36', [coordinates.lng, coordinates.lat]);

    var e = Number(point[0].toFixed(decimals));
    var n = Number(point[1].toFixed(decimals));

    return { ea: e, no: n };
  }

  /**
   * Return WGS latlng from an input easting + northing.
   * @param {object} coordinates - The easting + northing to be transformed.
   * @param {integer} decimals - [optional] The specified number of decimal places.
   */
  OSGBtoWGS(coordinates: any, decimals: number = 7): object {
    var test = this.checkBounds(coordinates);
    if (!test) {
      return {};
    }

    var point = proj4('OSGB36', 'WGS84', [coordinates.ea, coordinates.no]);

    var lng = Number(point[0].toFixed(decimals));
    var lat = Number(point[1].toFixed(decimals));

    return { lat: lat, lng: lng };
  }

  /**
   * Return OSTN15 national grid coordinates from WGS84 lat/lng.
   * @param {object} coordinates - The easting + northing to be transformed.
   * @param {integer} decimals - [optional] The specified number of decimal places.
   */
  WGStoOSTN(coordinates: any, decimals: number = 7): object {
    // var test = this.checkBounds(coordinates);
    // if (!test) {
    //   return {};
    // }

    var point = proj4('WGS84', 'OSTN15', [coordinates.lng, coordinates.lat]);

    var ea = Number(point[0].toFixed(decimals));
    var no = Number(point[1].toFixed(decimals));

    return { ea: ea, no: no };
  }
}
