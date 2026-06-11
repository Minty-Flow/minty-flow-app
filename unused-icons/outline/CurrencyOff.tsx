import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyOff = (props: SvgProps) => (
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
    <Path d="M18.531 14.524a7 7 0 0 0 -9.06 -9.053m-2.422 1.582a7 7 0 0 0 9.903 9.896" />
    <Path d="M4 4l3 3" />
    <Path d="M20 4l-3 3" />
    <Path d="M4 20l3 -3" />
    <Path d="M20 20l-3 -3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCurrencyOff;
