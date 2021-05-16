import { Data } from "./Schemas";

export function sortByProperty(property: string) {
  return function (a: any, b: any) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}

export const filterBids = (bids: any, status = 0) => {
  if (bids?.length === 0) {
    return 0;
  }
  const amountArray = bids?.map((item: any) => item?.amount);
  const maxBid = Math.max.apply(Math, amountArray);
  const minBid = Math.min.apply(Math, amountArray);
  if (status) {
    return minBid;
  }
  return maxBid;
};

export function createDataOfMinMaxBid(
  customerName: string,
  image: string,
  email: string,
  phone: string,
  premium: string,
  bid: {
    minBid: number;
    maxBid: number;
  }
): any {
  return { customerName, image, email, phone, premium, bid };
}

export function createData(
  customerName: string,
  image: string,
  email: string,
  phone: string,
  premium: string,
  bid: number | undefined
): Data {
  return { customerName, image, email, phone, premium, bid };
}
