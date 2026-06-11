import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPasswordFingerprint = (props: SvgProps) => (
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
    <Path d="M17 8c.788 1 1 2 1 3v1" />
    <Path d="M9 11c0 -1.578 1.343 -3 3 -3s3 1.422 3 3v2" />
    <Path d="M12 11v2" />
    <Path d="M6 12v-1.397c-.006 -1.999 1.136 -3.849 2.993 -4.85a6.385 6.385 0 0 1 6.007 -.005" />
    <Path d="M12 17v4" />
    <Path d="M10 20l4 -2" />
    <Path d="M10 18l4 2" />
    <Path d="M5 17v4" />
    <Path d="M3 20l4 -2" />
    <Path d="M3 18l4 2" />
    <Path d="M19 17v4" />
    <Path d="M17 20l4 -2" />
    <Path d="M17 18l4 2" />
  </Svg>
);
export default SvgPasswordFingerprint;
