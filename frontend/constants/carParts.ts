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
    title: "Full Car PPF",
    parts: [
      { name: "Bonnet", code: "BN001" },
      { name: "Roof", code: "RF001" },
      { name: "Front Bumper", code: "FB001" },
      { name: "Rear Bumper", code: "RB001" },
      { name: "Right Rocker Panel", code: "RRP001" },
      { name: "Left Rocker Panel", code: "LRP001" },
      { name: "Front Right Fender", code: "FRF001" },
      { name: "Front Left Fender", code: "FLF001" },
      { name: "Rear Right Fender", code: "RRF001" },
      { name: "Rear Left Fender", code: "RLF001" },
      { name: "Front Right Door Handle", code: "FRDH001" },
      { name: "Front Left Door Handle", code: "FLDH001" },
      { name: "Rear Right Door Handle", code: "RRDH001" },
      { name: "Rear Left Door Handle", code: "RLDH001" },
      { name: "Right A-Pillar", code: "RAP001" },
      { name: "Left A-Pillar", code: "LAP001" },
      { name: "Right B-Pillar", code: "RBP001" },
      { name: "Left B-Pillar", code: "LBP001" },
      { name: "Right C-Pillar", code: "RCP001" },
      { name: "Left C-Pillar", code: "LCP001" },
      { name: "Right Side Mirror", code: "RSM001" },
      { name: "Left Side Mirror", code: "LSM001" },
      { name: "Right Headlight", code: "RHL001" },
      { name: "Left Headlight", code: "LHL001" },
    ],
  },
  {
    title: "Full Front PPF",
    parts: [
      { name: "Bonnet", code: "BN001" },
      { name: "Front Bumper", code: "FB001" },
      { name: "Front Right Fender", code: "FRF001" },
      { name: "Front Left Fender", code: "FLF001" },
      { name: "Right Headlight", code: "RHL001" },
      { name: "Left Headlight", code: "LHL001" },
      { name: "Right Side Mirror", code: "RSM001" },
      { name: "Left Side Mirror", code: "LSM001" },
      { name: "Front Right Door Handle", code: "FRDH001" },
      { name: "Front Left Door Handle", code: "FLDH001" },
      { name: "Rear Right Door Handle", code: "RRDH001" },
      { name: "Rear Left Door Handle", code: "RLDH001" },
    ],
  },
  {
    title: "Partial Front PPF",
    parts: [
      { name: "Front Bumper", code: "FB001" },
      { name: "Rear Bumper", code: "RB001" },
      { name: "Right Headlight", code: "RHL001" },
      { name: "Left Headlight", code: "LHL001" },
      { name: "Front Right Side Step", code: "FRSS001" },
      { name: "Front Left Side Step", code: "FLSS001" },
      { name: "Rear Right Side Step", code: "RRSS001" },
      { name: "Rear Left Side Step", code: "RLSS001" },
      { name: "Front Right Door Handle", code: "FRDH001" },
      { name: "Front Left Door Handle", code: "FLDH001" },
      { name: "Rear Right Door Handle", code: "RRDH001" },
      { name: "Rear Left Door Handle", code: "RLDH001" },
    ],
  },
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
