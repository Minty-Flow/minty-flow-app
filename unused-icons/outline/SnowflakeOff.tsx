import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSnowflakeOff = (props: SvgProps) => (
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
    <Path d="M10 4l2 1l2 -1" />
    <Path d="M12 2v6m1.196 1.186l1.804 1.034" />
    <Path d="M17.928 6.268l.134 2.232l1.866 1.232" />
    <Path d="M20.66 7l-5.629 3.25l-.031 .75" />
    <Path d="M19.928 14.268l-1.015 .67" />
    <Path d="M14.212 14.226l-2.171 1.262" />
    <Path d="M14 20l-2 -1l-2 1" />
    <Path d="M12 22v-6.5l-3 -1.72" />
    <Path d="M6.072 17.732l-.134 -2.232l-1.866 -1.232" />
    <Path d="M3.34 17l5.629 -3.25l-.01 -3.458" />
    <Path d="M4.072 9.732l1.866 -1.232l.134 -2.232" />
    <Path d="M3.34 7l5.629 3.25l.802 -.466" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSnowflakeOff;
