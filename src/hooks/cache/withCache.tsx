import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";

interface CacheProps {
  children: React.ReactNode;
}

const WithCache = (props: CacheProps) => {
  const cacheLtr = createCache({
    key: "muiltr",
    stylisPlugins: [prefixer],
  });

  return <CacheProvider value={cacheLtr}>{props.children}</CacheProvider>;
};

export default WithCache;
