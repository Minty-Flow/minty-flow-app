import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCouchdb = (props: SvgProps) => (
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
    <Path d="M6 12h12v-2a2 2 0 0 1 2 -2a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2a2 2 0 0 1 2 2v2" />
    <Path d="M6 15h12" />
    <Path d="M6 18h12" />
    <Path d="M21 11v7" />
    <Path d="M3 11v7" />
  </Svg>
);
export default SvgBrandCouchdb;
