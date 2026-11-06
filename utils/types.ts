export type Response<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type ResponsePaginationType<T> = {
  status: boolean;
  message: string;
  data: T;
  current: number;
  pageSize: number;
  total: number;
};

export type AuthResponseType = {
  access_token: string;
  token_type: string;
  scope: string;
};

export type ShopType = {
  id: number;
  environment: string;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  website: string;
  timeZoneId: string;
  address: {
    id: number;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
    streetAddress: string;
  };
  roCustomLabelEnabled: boolean;
};

export type Pagination<T> = {
  content: Array<T>;
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
};

export type EmployeesType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: {
    id: number;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
    streetAddress: string;
  } | null;
  employeeRole: {
    id: number;
    code: string;
    name: string;
  };
  employeePayType: {
    id: number;
    code: string;
    name: string;
  };
  salary: number;
  hourlyRate: number;
  disabled: boolean;
  canPerformWork: boolean;
  createdDate: Date;
  updatedDate: Date;
  certificationNumber: null | string;
};

export type FeesOrDiscountType = {
  id: number;
  name: string;
  total: number;
};

export type PartType = {
  id: number;
  quantity: number;
  brand: string;
  name: string;
  partNumber: string;
  description: string;
  cost: number;
  retail: number;
  model: string | null;
  width: string | null;
  ratio: number | null;
  diameter: number | null;
  constructionType: string | null;
  loadIndex: string | null;
  speedRating: string | null;
  partType: {
    id: number;
    code: string;
    name: string;
  };
  partStatus: {
    id: number;
    code: string;
    name: string;
  };
  dotNumbers: Array<string>;
  tireType: any;
  mileageWarranty: any;
  loadRange: any;
  tireCategory: any;
  runFlat: boolean | null;
  sideWallStyle: any;
  treadwear: any;
  traction: any;
  temperature: string | number | null;
};

export type JobType = {
  id: number;
  repairOrderId: number;
  vehicleId: number;
  customerId: number;
  name: string;
  authorized: boolean;
  authorizedDate: Date;
  selected: boolean;
  technicianId: number | null;
  note: string | null;
  cannedJobId: number | null;
  jobCategoryName: string | null;
  partsTotal: number;
  laborTotal: number;
  discountTotal: number;
  feeTotal: number;
  subtotal: number;
  archived: boolean;
  createdDate: Date;
  completedDate: Date;
  updatedDate: Date;
  labor: Array<{
    id: number;
    name: string;
    rate: number;
    hours: number;
    complete: boolean;
    paymentStatus: boolean;
    payment: Array<{
      id: number;
      amount: number;
      comment: string;
      createdAt: Date;
    }>;
  }>;
  parts: Array<PartType>;
  fees: Array<FeesOrDiscountType>;
  discounts: Array<FeesOrDiscountType>;
  laborHours: number;
  loggedHours: number | null;
  sort: number;
};

export type SubletsType = {
  id: number;
  name: string;
  vendor: {
    id: number;
    name: string;
    nickname: string;
    website: string | null;
    phone: string | null;
  };
  authorized: boolean | null;
  authorizedDate: Date | null;
  selected: boolean;
  note: string;
  items: [
    {
      id: number;
      name: string;
      cost: number;
      price: number;
      complete: boolean;
    }
  ];
  price: number;
  cost: number;
};

export type RepairOrderType = {
  id: number;
  repairOrderNumber: number;
  shopId: number;
  repairOrderStatus: {
    id: number;
    code: string;
    name: string;
    postedOrAccrecv: boolean;
  };
  repairOrderLabel: {
    id: number;
    code: string;
    name: string;
    status: {
      id: number;
      code: string;
      name: string;
      postedOrAccrecv: boolean;
    };
  };
  repairOrderCustomLabel: {
    name: string;
  };
  color: string;
  appointmentId: number;
  customerId: number;
  technicianId: number | null;
  serviceWriterId: number;
  vehicleId: number;
  milesIn: number;
  milesOut: number;
  keytag: string | null;
  completedDate: Date;
  postedDate: Date;
  laborSales: number;
  partsSales: number;
  subletSales: number;
  discountTotal: number;
  feeTotal: number;
  taxes: number;
  amountPaid: number;
  totalSales: number;
  jobs: Array<JobType>;
  sublets: Array<SubletsType>;
  fees: Array<FeesOrDiscountType>;
  discounts: Array<FeesOrDiscountType>;
  customerConcerns: Array<{
    id: number;
    concern: string;
    techComment: string | null;
  }> | null;
  createdDate: Date;
  updatedDate: Date;
  deletedDate: Date | null;
  estimateShareDate: Date | null;
  inspectionShareDate: Date | null;
  customerTimeOut: Date | null;
  estimateUrl: Date;
  inspectionUrl: Date;
  invoiceUrl: Date;
  leadSource: string | null;
};

export type RepairOrderExpandTableType = {
  key: number;
  repairOrderId: number;
  repairOrderNumber: number;
  jobId: number;
  jobName: string;
  laborId: number;
  laborName: string;
  hours: number;
  rate: number;
  paidPayment: number;
  complete: boolean;
  paymentStatus: boolean;
  payment: Array<{
    id: number;
    comment: string;
    amount: number;
    createdAt: Date;
  }>;
};

export type RepairOrderTableType = {
  repairOrder: number;
  key: number;
  // customerTimeOut: string;
  // completedDate: string;
  // total: number;
  // totalPaid: number;
  totalDue: string;
  laborHours: number;
  laborPaidHours: number;
  laborDueHours: number;
  repairOrderStatus: string;
  labor: Array<RepairOrderExpandTableType>;
};

export type DescriptionType = {
  key: number;
  item: number;
  description: string;
};

export type PaymentType = {
  key: number;
  labourId: number;
  amount: number;
  comment: string;
  createdAt: Date;
};

export type TablePaginationType = {
  current: number;
  pageSize: number;
  total: number;
};

export type PaymentBodyType = {
  shopId: string;
  shopName: string;
  employeeId: string;
  employeeEmail: string;
  repairOrderId: string;
  repairOrderNumber: string;
  jobId: string;
  jobName: string;
  labourId: string;
  labourName: string;
  comment: string;
  amount: number;
};

export type PaymentResponseType = {
  id: number;
  repairOrderId: string;
  repairOrderNumber: string;
  jobId: string;
  jobName: string;
  labourId: string;
  labourName: string;
  comment: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};
