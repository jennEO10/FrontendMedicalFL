export default function InformacionAdicional() {
  return (
    <main className="p-6 md:p-10 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <section className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Información adicional</h1>

        <div className="space-y-5 text-base md:text-lg text-gray-700 dark:text-gray-300 text-justify">
          <p>
            Esta plataforma ha sido diseñada con el objetivo de preservar la privacidad de los datos clínicos sensibles mediante el uso de aprendizaje federado. Todos los modelos de inteligencia artificial se entrenan localmente en cada institución médica, evitando la transferencia de datos personales hacia servidores externos.
          </p>
          <p>
            El sistema ha sido desarrollado específicamente para asistir en la predicción de partos prematuros en clínicas y hospitales de Lima Metropolitana. Su uso debe entenderse como una herramienta de apoyo complementario para la toma de decisiones médicas, y no como un reemplazo del juicio clínico profesional.
          </p>
          <p>
            El uso de esta herramienta requiere que los datos utilizados cuenten con el debido consentimiento informado del paciente, conforme a la Ley Nº 29733 de Protección de Datos Personales en Perú, y alineado con principios del GDPR y la HIPAA. La responsabilidad sobre la gestión de dichos consentimientos recae exclusivamente en cada institución usuaria.
          </p>
          <p>
            Las predicciones generadas por el modelo no deben ser utilizadas fuera del contexto médico previsto. Su precisión puede variar según la calidad de los datos locales, y un uso indebido o con datos incompletos puede afectar el rendimiento del sistema.
          </p>
          <p>
            Esta solución fue desarrollada bajo principios éticos y de ciberseguridad, incorporando controles técnicos como cifrado, autenticación segura, auditoría de acceso y mecanismos de monitoreo, para mitigar los riesgos asociados al uso de modelos de IA en el sector salud.
          </p>
          <p>
            Para soporte técnico o consultas relacionadas con el uso de la plataforma, comuníquese con el administrador designado en su institución.
          </p>
          <p className="text-base italic text-gray-500 dark:text-gray-400">
            Última actualización del modelo federado: 17/08/2025
          </p>
        </div>
      </section>
    </main>
  );
}
