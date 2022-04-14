import axios from "axios";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("renders", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      result: [
        {
          symbol: "s1",
          description: "description1",
          underlying_asset: {
            symbol: "uaS1",
          },
        },
        {
          symbol: "s2",
          description: "description2",
          underlying_asset: {
            symbol: "uaS2",
          },
        },
      ],
    },
  });

  const { getByText } = render(<App />);
  await waitFor(() => {
    expect(getByText("s1")).toBeInTheDocument();
    expect(getByText("description2")).toBeInTheDocument();
  });
});
