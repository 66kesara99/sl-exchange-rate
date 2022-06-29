import React, { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import {
  ChakraProvider,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Container,
  Heading,
  Center,
} from "@chakra-ui/react";

import { Select } from "@chakra-ui/react";

function App() {
  const [buyRates, setBuyRates] = useState([]);
  const [sellRates, setSellRates] = useState([]);
  const [exsistingCurrency, setExsistingCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("LKR");
  const [amount, setAmount] = useState(1);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/1P4lM9rbPvaumunEwm86V9FE5XcBeuT5OJngNfs6NP9o/gviz/tq?tqx=out:csv&gid=933682448",
      {
        download: true,
        complete: (results: any) => {
          setBuyRates(results.data);
          setLastUpdatedTime(results.data[0][12]);
          if (sellRates) {
            setisLoading(false);
          }
        },
      }
    );
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/1P4lM9rbPvaumunEwm86V9FE5XcBeuT5OJngNfs6NP9o/gviz/tq?tqx=out:csv&gid=1769421601",
      {
        download: true,
        complete: (results: any) => {
          setSellRates(results.data);
          if (buyRates) {
            setisLoading(false);
          }
        },
      }
    );
  }, []);

  useEffect(() => {
    if (!isLoading) {
      populateTable();
    }
  }, [amount, exsistingCurrency, targetCurrency]);

  const currencyList = {
    LKR: { code: "LKR", index: 0, name: "" },
    USD: { code: "USD", index: 2, name: "" },
    GBP: { code: "GBP", index: 3, name: "" },
    EUR: { code: "EUR", index: 4, name: "" },
    AED: { code: "AED", index: 5, name: "" },
    AUD: { code: "AUD", index: 6, name: "" },
    BHD: { code: "BHD", index: 7, name: "" },
    CAD: { code: "CAD", index: 8, name: "" },
    CHF: { code: "CHF", index: 9, name: "" },
    CNY: { code: "CNY", index: 10, name: "" },
    DKK: { code: "DKK", index: 11, name: "" },
    HKD: { code: "HKD", index: 12, name: "" },
    JOD: { code: "JOD", index: 13, name: "" },
    JPY: { code: "JPY", index: 14, name: "" },
    KWD: { code: "KWD", index: 15, name: "" },
    NOK: { code: "NOK", index: 16, name: "" },
    NZD: { code: "NZD", index: 17, name: "" },
    OMR: { code: "OMR", index: 18, name: "" },
    QAR: { code: "QAR", index: 19, name: "" },
    RMB: { code: "RMB", index: 20, name: "" },
    SAR: { code: "SAR", index: 21, name: "" },
    SEK: { code: "SEK", index: 22, name: "" },
    SGD: { code: "SGD", index: 23, name: "" },
    TBH: { code: "TBH", index: 24, name: "" },
    ZAR: { code: "ZAR", index: 25, name: "" },
  };

  const bankList = {
    Amana: { index: 2, name: "Amana Bank" },
    BankOfChina: { index: 3, name: "Bank of China" },
    BOC: { index: 4, name: "Bank of Ceylon" },
    Cargills: { index: 5, name: "Cargills Bank" },
    Commercial: { index: 6, name: "Commercial Bank" },
    DeutscheBank: { index: 7, name: "Deutsche Bank" },
    DFCC: { index: 8, name: "DFCC Bank" },
    HNB: { index: 9, name: "Hatton National Bank" },
    HSBC: { index: 10, name: "HSBC Bank" },
    MCB: { index: 11, name: "MCB Bank" },
    NDB: { index: 12, name: "NDB" },
    NSB: { index: 13, name: "NSB" },
    NTB: { index: 14, name: "NTB" },
    PanAsia: { index: 15, name: "Pan Asia Bank" },
    PeoplesBank: { index: 16, name: "Peoples Bank" },
    Sampath: { index: 17, name: "Sampath Bank" },
    Seylan: { index: 18, name: "Seylan Bank" },
    StandardChartered: { index: 19, name: "Standard Chartered Bank" },
    StateBankOfIndia: { index: 20, name: "State Bank of India" },
    UnionBank: { index: 21, name: "Union Bank" },
  };

  const changeValue = (event: any) => {
    setAmount(event.target.value);
  };

  const changeExsistingCurrency = (event: any) => {
    const currency = event.target.value;
    if (currency !== "LKR") {
      setTargetCurrency("LKR");
    }
    setExsistingCurrency(event.target.value);
  };
  const changeTargetCurrency = (event: any) => {
    setTargetCurrency(event.target.value);
  };

  const getSellRate = (bank: string) =>
    sellRates[bankList[bank as keyof typeof bankList].index][
      currencyList[targetCurrency as keyof typeof currencyList].index
    ];

  const getBuyRate = (bank: string) =>
    buyRates[bankList[bank as keyof typeof bankList].index][
      currencyList[exsistingCurrency as keyof typeof currencyList].index
    ];

  const populateTable = () => {
    const data: any[] = [];

    if (exsistingCurrency === "LKR") {
      if (targetCurrency === "LKR") {
        Object.keys(bankList).forEach((bank) => {
          data.push({
            bank: bankList[bank as keyof typeof bankList].name,
            rate: 1,
            amount,
          });
        });
      } else {
        Object.keys(bankList).forEach((bank) => {
          const sellRate = getSellRate(bank);
          if (sellRate) {
            data.push({
              bank: bankList[bank as keyof typeof bankList].name,
              rate: sellRate,
              amount: amount / sellRate,
            });
          }
        });
      }
    } else {
      Object.keys(bankList).forEach((bank) => {
        const buyRate = getBuyRate(bank);
        if (buyRate) {
          data.push({
            bank: bankList[bank as keyof typeof bankList].name,
            rate: buyRate,
            amount: amount * buyRate,
          });
        }
      });
    }
    data.sort((a, b) => b.rate - a.rate);
    setTableData(data);
  };

  return (
    <ChakraProvider>
      <Container maxW="1000px">
        <Center m="10">
          <Heading textAlign="center">
            Sri Lankan Currency Exchange Rate Calculator
          </Heading>
        </Center>
        <Center m="2">
          <Text fontSize="md">Last updated time: {lastUpdatedTime}</Text>
        </Center>
        <FormControl>
          <FormLabel htmlFor="number" mt="5">
            Amount you have
          </FormLabel>
          <NumberInput defaultValue={1} precision={2} step={0.2}>
            <NumberInputField onBlur={changeValue} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel htmlFor="number" mt="5">
            Currency you have
          </FormLabel>
          <Select onChange={changeExsistingCurrency} value={exsistingCurrency}>
            {Object.keys(currencyList).map((curr: string) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </Select>
          <FormLabel htmlFor="number" mt="5">
            Currency you wanna exchange
          </FormLabel>
          <Select
            onChange={changeTargetCurrency}
            value={targetCurrency}
            disabled={exsistingCurrency !== "LKR"}
          >
            {Object.keys(currencyList).map((curr: string) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </Select>
        </FormControl>

        <TableContainer mt="5">
          <Table variant="simple">
            <TableCaption placement="top" mb="2">
              Amount you get from each bank
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Bank</Th>
                <Th isNumeric>
                  Bank Rate ({exsistingCurrency} {"->"} {targetCurrency})
                </Th>
                <Th isNumeric>Amount you get ({targetCurrency})</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData &&
                tableData.map((data) => (
                  <Tr key={data.bank}>
                    <Td>{data.bank}</Td>
                    <Td isNumeric>{parseFloat(data.rate).toFixed(2)}</Td>
                    <Td isNumeric>{parseFloat(data.amount).toFixed(2)}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </ChakraProvider>
  );
}

export default App;
