export type User = {
  id: string;
  name: string;
  avatarColor: string;
};

export type Message = {
  id:string;
  sender: User;
  timestamp: number;
} & (
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'file';
      file: {
        name: string;
        type: string;
        size: number;
        url: string; // data URL
      };
    }
  | {
      type: 'summary';
      url: string;
      summary: string;
    }
  | {
      type: 'info';
      content: string;
    }
);
