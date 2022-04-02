import { Test, TestingModule } from '@nestjs/testing';
import { CoordsService } from './coords.service';

describe('CoordsService', () => {
  let service: CoordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoordsService],
    }).compile();

    service = module.get<CoordsService>(CoordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialise the ETRS buffer on instantiation', () => {
    expect(service._buffer.byteLength).toBeGreaterThan(15000000);
  });

  it('should check OSGB bounds', () => {
    expect(service.checkBounds({ ea: 1000, no: 1000 })).toBeTruthy();
    expect(service.checkBounds({ ea: 0, no: 0 })).toBeTruthy();
    expect(service.checkBounds({ ea: -1, no: 0 })).toBeFalsy();
    expect(service.checkBounds({ ea: 0, no: -1 })).toBeFalsy();
    expect(service.checkBounds({ ea: 700000, no: 0 })).toBeFalsy();
    expect(service.checkBounds({ ea: 0, no: 1300000 })).toBeFalsy();
  });

  it('should check WGS bounds', () => {
    expect(service.checkBounds({ lng: 1, lat: 51 })).toBeTruthy();
    expect(service.checkBounds({ lng: -9, lat: 51 })).toBeFalsy();
    expect(service.checkBounds({ lng: +2, lat: 51 })).toBeFalsy();
    expect(service.checkBounds({ lng: 1, lat: 49 })).toBeFalsy();
    expect(service.checkBounds({ lng: 1, lat: 61 })).toBeFalsy();
  });

  it('should validate OSGB grid references', () => {
    expect(service._validateGridRef('TL137055')).toBeTruthy();
    expect(service._validateGridRef('TL10')).toBeTruthy();
    expect(service._validateGridRef('TL 13700 05500')).toBeTruthy();
    expect(service._validateGridRef('TL 137 055')).toBeTruthy();
    expect(service._validateGridRef('TL 137055')).toBeTruthy();
    expect(service._validateGridRef('TL13700055100')).toBeFalsy();
    expect(service._validateGridRef('TL1370551')).toBeFalsy();
  });

  it('should convert OSGB coordinates to grid references', () => {
    expect(service.toGridRef({ ea: 513700, no: 205500 })).toEqual(
      'TL 13700 05500',
    );
    expect(service.toGridRef({ ea: -10, no: -10 })).toEqual('');
  });

  it('should convert grid references to OSGB coordinates', () => {
    expect(service.fromGridRef('TL137055')).toEqual({ ea: 513700, no: 205500 });
    expect(service.fromGridRef('TL 137 055')).toEqual({
      ea: 513700,
      no: 205500,
    });
    expect(service.fromGridRef('TL137')).toEqual({});
  });

  // http://www.nearby.org.uk/coord.cgi?p=TL137055&f=full
  it('should accurately convert OSGB to WGS coordinates', () => {
    expect(service.OSGBtoWGS({ ea: 513700, no: 205500 })['lat']).toBeCloseTo(
      51.736685,
      6,
    );
    expect(service.OSGBtoWGS({ ea: 513700, no: 205500 })['lng']).toBeCloseTo(
      -0.354826,
      6,
    );
  });

  it('should convert OSGB to WGS coordinates with rounding', () => {
    expect(service.OSGBtoWGS({ ea: 513700, no: 205500 }, 3)['lat']).toBeCloseTo(
      51.736685,
      3,
    );
    expect(service.OSGBtoWGS({ ea: 513700, no: 205500 }, 3)['lng']).toBeCloseTo(
      -0.354826,
      3,
    );
  });

  it('should convert WGS to OSGB coordinates', () => {
    expect(
      service.WGStoOSGB({ lng: -0.354826, lat: 51.736685 })['ea'],
    ).toBeCloseTo(513700, 0);
    expect(
      service.WGStoOSGB({ lng: -0.354826, lat: 51.736685 })['no'],
    ).toBeCloseTo(205500, 0);
  });

  // https://www.ordnancesurvey.co.uk/gps/legacy-control-information/C1SE7961
  it('should accurately convert WGS to OSTN coordinates', () => {
    expect(
      service.WGStoOSTN({ lat: 54.044144842, lng: -0.788782089 }, 3)['ea'],
    ).toBeCloseTo(479409.658, 2);
    expect(
      service.WGStoOSTN({ lat: 54.044144842, lng: -0.788782089 }, 3)['no'],
    ).toBeCloseTo(461584.573, 1.9);
  });

  it('should check bounds for WGS to OSGB conversion', () => {
    expect(service.WGStoOSGB({ lat: 20, lng: 20 })).toEqual({});
  });
  it('should check bounds for OSGB to WGS conversion', () => {
    expect(service.OSGBtoWGS({ lat: 20, lng: 20 })).toEqual({});
  });
  it('should check bounds for WGS to OSTN conversion', () => {
    expect(service.WGStoOSTN({ lat: 20, lng: 20 })).toEqual({});
  });
});
