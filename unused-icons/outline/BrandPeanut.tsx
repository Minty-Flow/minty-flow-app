import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPeanut = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M15 16.25l-.816 -.36l-.462 -.196c-1.444 -.592 -2 -.593 -3.447 0l-.462 .195l-.817 .359a4.5 4.5 0 1 1 0 -8.49l1.054 .462l.434 .178c1.292 .507 1.863 .48 3.237 -.082l.462 -.195l.817 -.359a4.5 4.5 0 1 1 0 8.49" />
  </Svg>
);
export default SvgBrandPeanut;
