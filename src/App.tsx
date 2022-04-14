import { useEffect, useState } from "react";
import { Table, Container, Skeleton, Loader, Pagination } from "@mantine/core";
import axios from "axios";
import { useStyles } from "./App.styles";
interface IProduct {
  symbol: string;
  description: string;
  underlying_asset: string;
  markPrice: string | null;
}

function App() {
  const LIMIT = 5; // data per paginate page
  const styles = useStyles();
  const [products, setProducts] = useState<{ [key: string]: IProduct }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [beforeCursor, setBeforeCursor] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0); // total data
  const [activePage, setPage] = useState<number>(1);
  const [paginateAction, setPaginateAction] = useState<1 | -1 | undefined>(); // 1: next, -1: previous, undefined: current page

  /**
   * @description get data from api
   * @param paginateAction : 1: next, -1: previous, undefined: current page
   */
  const handleFetch = async (paginateAction?: 1 | -1) => {
    if (paginateAction) setIsLoading(true);
    try {
      const res = await axios.get("https://api.delta.exchange/v2/products", {
        params: {
          page_size: LIMIT,
          after: paginateAction! > 0 ? afterCursor : null,
          before: paginateAction! < 0 ? beforeCursor : null,
        },
      });
      setAfterCursor(res.data?.meta?.after);
      setBeforeCursor(res.data?.meta?.before);
      setTotal(res.data?.meta?.total_count);
      const dataObj: { [key: string]: IProduct } = {};
      res.data?.result.forEach((item: { [key: string]: any }) => {
        dataObj[item.symbol as string] = {
          symbol: item.symbol,
          description: item.description,
          underlying_asset: item["underlying_asset"].symbol,
          markPrice: null,
        };
      });
      setProducts(dataObj);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  /**
   *
   * @description get data from websocket
   */
  const handleWS = () => {
    const ws = new WebSocket("wss://production-esocket.delta.exchange");
    const subMsg = {
      type: "subscribe",
      payload: {
        channels: [
          {
            name: "v2/ticker",
            symbols: Object.entries(products).map(
              ([key, value]) => value.symbol
            ),
          },
        ],
      },
    };
    ws.onopen = (event) => {
      ws.send(JSON.stringify(subMsg));
    };
    ws.onmessage = function (event) {
      try {
        if (event.data) {
          const json = JSON.parse(event.data);
          if (json.mark_price) {
            const tempObj = { ...products };
            tempObj[json.symbol].markPrice = json.mark_price;
            setProducts(tempObj);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    return ws;
  };

  useEffect(() => {
    handleFetch(paginateAction);
  }, [activePage]);

  useEffect(() => {
    let ws: WebSocket;
    if (!isLoading) {
      ws = handleWS();
    }
    return () => {
      if (ws) ws.close();
    };
  }, [isLoading, paginateAction]);

  const rows = isLoading
    ? Array.from(new Array(3)).map((_, index) => (
        <tr key={`loading-${index}`}>
          <td>
            <Skeleton height={8} radius="xl" />
          </td>
          <td>
            <Skeleton height={8} radius="xl" />
          </td>
          <td>
            <Skeleton height={8} radius="xl" />
          </td>
          <td>
            <Skeleton height={8} radius="xl" />
          </td>
        </tr>
      ))
    : Object.entries(products).map(([key, value]) => (
        <tr key={`row-${key}`}>
          <td>{value.symbol}</td>
          <td>{value.description}</td>
          <td>{value.underlying_asset}</td>
          <td>
            {value.markPrice ? (
              value.markPrice
            ) : (
              <Loader color="teal" variant="dots" />
            )}
          </td>
        </tr>
      ));

  return (
    <Container style={{ height: "100%" }} fluid>
      <div className={styles.classes.tableContainer}>
        <Table className={styles.classes.table}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Description</th>
              <th>Underlying Asset</th>
              <th>Mark Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
      <div className={styles.classes.paginationContainer}>
        <Pagination
          page={activePage}
          onChange={(number) => {
            setPage(number);
            if (number > activePage) {
              setPaginateAction(1);
            } else if (number < activePage) {
              setPaginateAction(-1);
            } else {
              setPaginateAction(undefined);
            }
          }}
          total={total > 0 ? Math.ceil(total / LIMIT) : 0}
        />
      </div>
    </Container>
  );
}

export default App;
