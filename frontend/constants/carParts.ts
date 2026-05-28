type CarPart = {
  name: string;
  code: string;
};

export const carParts: CarPart[] = [
  { name: "Front Windscreen", code: "FWS" },
  { name: "Front Right", code: "R1" },
  { name: "Front Left", code: "L1" },
  { name: "Rear Right", code: "R2" },
  { name: "Rear Left", code: "L2" },
  { name: "Rear Windscreen", code: "RWS" },
  { name: "Sunroof", code: "Sunroof" },
  { name: "Front Bumper", code: "FB" },
  { name: "Rear Bumper", code: "RB" },
];

type CarPartsCombinationData = {
  title: string;
  parts: {
    name: string;
    code: string;
  }[];
};

export const CAR_PARTS_COMBINATIONS: CarPartsCombinationData[] = [
  {
    title: "Full Car Tinting (MPV)",
    parts: [
      { name: "Front Windscreen", code: "FW001" },
      { name: "Rear Windscreen", code: "RW001" },
      { name: "Front Right Side Window", code: "FRSW001" },
      { name: "Front Left Side Window", code: "FLSW001" },
      { name: "Middle Right Side Window", code: "MRSW001" },
      { name: "Middle Left Side Window", code: "MLSW001" },
      { name: "Rear Right Side Window", code: "RRSW001" },
      { name: "Rear Left Side Window", code: "RLSW001" },
      { name: "Front Right Quarter Glass", code: "FRQG001" },
      { name: "Front Left Quarter Glass", code: "FLQG001" },
      { name: "Rear Right Quarter Glass", code: "RRQG001" },
      { name: "Rear Left Quarter Glass", code: "RLQG001" },
      { name: "Sunroof", code: "SR001" },
      { name: "Moonroof", code: "MR001" },
      { name: "Panoramic Roof", code: "PR001" },
    ],
  },
  {
    title: "Full Car Tinting (SUV)",
    parts: [
      { name: "Front Windscreen", code: "FW001" },
      { name: "Rear Windscreen", code: "RW001" },
      { name: "Front Right Side Window", code: "FRSW001" },
      { name: "Front Left Side Window", code: "FLSW001" },
      { name: "Rear Right Side Window", code: "RRSW001" },
      { name: "Rear Left Side Window", code: "RLSW001" },
      { name: "Front Right Quarter Glass", code: "FRQG001" },
      { name: "Front Left Quarter Glass", code: "FLQG001" },
      { name: "Rear Right Quarter Glass", code: "RRQG001" },
      { name: "Rear Left Quarter Glass", code: "RLQG001" },
      { name: "Sunroof", code: "SR001" },
      { name: "Moonroof", code: "MR001" },
      { name: "Panoramic Roof", code: "PR001" },
    ],
  },
  {
    title: "Full Car Tinting (Compact)",
    parts: [
      { name: "Front Windscreen", code: "FW001" },
      { name: "Rear Windscreen", code: "RW001" },
      { name: "Front Right Side Window", code: "FRSW001" },
      { name: "Front Left Side Window", code: "FLSW001" },
      { name: "Rear Right Side Window", code: "RRSW001" },
      { name: "Rear Left Side Window", code: "RLSW001" },
    ],
  },
  {
    title: "Full Front Tinting",
    parts: [
      { name: "Front Windscreen", code: "FW001" },
      { name: "Front Right Side Window", code: "FRSW001" },
      { name: "Front Left Side Window", code: "FLSW001" },
    ],
  },
];
