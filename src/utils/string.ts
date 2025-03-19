import _ from "lodash";

export const genCode = (length = 6): string => _.chain("9").repeat(length).parseInt().random().padStart(length, "0").value();
