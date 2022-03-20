export enum PhysicalType {
  PILLAR = 'Pillar',
  ACTIVE = 'Active station',
  BERNTSEN = 'Berntsen',
  BLOCK = 'Block',
  BOLT = 'Bolt',
  PLATE = 'Brass Plate',
  BURIED_BLOCK = 'Buried Block',
  CANNON = 'Cannon',
  CONCRETE_RING = 'Concrete Ring',
  CURRY_STOOL = 'Curry Stool',
  CUT = 'Cut',
  DISC = 'Disc',
  FBM = 'FBM',
  FENOMARK = 'Fenomark',
  INTERSECTED = 'Intersected Station',
  OTHER = 'Other',
  PIPE = 'Pipe',
  PLATFORM_BOLT = 'Platform Bolt',
  RIVET = 'Rivet',
  SPIDER = 'Spider',
  SURFACE_BLOCK = 'Surface Block',
  UNKNOWN = 'Unknown',
  USER_ADDED = 'Unknown - user added',
}

export enum CurrentUse {
  PASSIVE = 'Passive station',
  ACTIVE = 'Active station',
  NCE_ADJUSTMENT = 'NCE Adjustment',
  GPS = 'GPS Station',
  NONE = 'none',
  UNKNOWN = 'Unknown',
  USER_ADDED = 'Unknown - user added',
}

export enum HistoricUse {
  PRIMARY = 'Primary',
  SECONDARY = 'Secondary',
  THIRD_ORDER = '3rd order',
  FOURTH_ORDER = '4th order',
  THIRTEENTH_ORDER = '13th order - GPS',
  FBM = 'Fundamental Benchmark',
  HYDROGRAPHIC = 'Hydrographic Survey Station',
  GREAT_GLEN = 'Great Glen Project',
  PROJECT_EMILY = 'Project Emily',
  NONE = 'none',
  UNKNOWN = 'Unknown',
  USER_ADDED = 'Unknown - user added',
  OTHER = 'Other',
}

export enum TrigCondition {
  GOOD = 'G',
  SLIGHTLY_DAMAGED = 'S',
  DAMAGED = 'D',
  TOPPLED = 'T',
  MOVED = 'M',
  CONVERTED = 'C',
  REMAINS = 'R',
  POSSIBLY_MISSING = 'Q',
  DESTROYED = 'X',
  VISIBLE = 'V',
  INACCESSIBLE = 'P',
  NOT_FOUND = 'N',
  UNKNOWN = 'U',
  NOT_LOGGED = 'Z',
  OTHER = '-',
}

export enum Status {
  PILLAR = '10',
  MAJOR_MARK = '20',
  MINOR_MARK = '30',
  INTERSECTED = '40',
  USER_ADDED = '50',
  CONTROVERSIAL = '60',
  DELETED = '99',
  UNKNOWN = '0',
}

export enum Units {
  METRIC = 'K',
  IMPERIAL = 'M',
}

export enum Licence {
  PUBLIC_DOMAIN = 'public',
  PRIVATE = 'private',
  BY_ATTRIBUTION = 'attribution',
}

export enum LogSource {
  ANDROID_APP = 'A',
  WEBSITE = 'W',
  UNKNOWN = 'U',
}
