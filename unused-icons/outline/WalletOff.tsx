import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWalletOff = (props: SvgProps) => (
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
    <Path d="M17 8v-3a1 1 0 0 0 -1 -1h-8m-3.413 .584a2 2 0 0 0 1.413 3.416h2m4 0h6a1 1 0 0 1 1 1v3" />
    <Path d="M19 19a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
    <Path d="M16 12h4v4m-4 0a2 2 0 0 1 -2 -2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWalletOff;
