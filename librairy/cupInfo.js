export function getChannelBox(client) {
  const channelBoxInit = {
    commandChannel: "",
    maison: "",
    ohana: "",
  };
  return channelBoxInit;
}

export const idRoom = {
  commandChannel: "1031371693454807151",
  maison: "1026619386481627256",
  ohana: "1021509224343281764",
};

//export const listCupActive = ["potter", "ohana"];
export const cupActive = "1021509224343281764"; //tout en minuscule.

export const role = {
  //ID des Roles
  administrateur: "935655300730613850",
  moderateur: "936625195656024104",
};

// Barème des Bits & Subs
export const bareme = {
  bits: 5,
  subT1: 10,
  subT2: 20,
  subT3: 50,
  duel: 10,
};

// Barème des Bits & Sub en multiple
// Attention !!! Max 4 par type (bits, subT1,...)
export const bareme_multiple = {
  bits_500: 5 * bareme.bits,
  bits_1000: 10 * bareme.bits,
  bits_5000: 50 * bareme.bits,
  bits_10000: 100 * bareme.bits,
  subT1_5: bareme.subT1 * 5,
  subT1_10: bareme.subT1 * 10,
  subT1_20: bareme.subT1 * 20,
  subT1_50: bareme.subT1 * 50,
  subT2_5: bareme.subT2 * 5,
  subT2_10: bareme.subT2 * 10,
  subT2_20: bareme.subT2 * 20,
  subT2_50: bareme.subT2 * 50,
  subT3_5: bareme.subT3 * 5,
  subT3_10: bareme.subT3 * 10,
  subT3_20: bareme.subT3 * 20,
  subT3_50: bareme.subT3 * 50,
};
