import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilterCog = (props: SvgProps) => (
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
    <Path d="M12 20l-3 1v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v1.5" />
    <Path d="M17.001 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19.001 15.5v1.5" />
    <Path d="M19.001 21v1.5" />
    <Path d="M22.032 17.25l-1.299 .75" />
    <Path d="M17.27 20l-1.3 .75" />
    <Path d="M15.97 17.25l1.3 .75" />
    <Path d="M20.733 20l1.3 .75" />
  </Svg>
);
export default SvgFilterCog;
