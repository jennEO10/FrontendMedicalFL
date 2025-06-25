import mitt from 'mitt';

type AlertaEvents = {
  alertaCreada: void;
};

export const alertaEmitter = mitt<AlertaEvents>();