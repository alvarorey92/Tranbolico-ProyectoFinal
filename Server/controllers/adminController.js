const connection = require("../config/db");

class AdminController {
  getRoutes = (req, res) => {
    const sql = `SELECT 
    r.route_id, 
    dp.province_id AS departure_province_id, 
    dp.name AS departure_province, 
    dc.city_id AS departure_city_id, 
    dc.city_name AS departure_city, 
    ap.province_id AS arrival_province_id, 
    ap.name AS arrival_province, 
    ac.city_id AS arrival_city_id, 
    ac.city_name AS arrival_city, 
    r.text, 
    r.is_disabled
  FROM route r JOIN city dc ON r.departure_province_id = dc.province_id 
  AND r.departure_city_id = dc.city_id JOIN province dp 
  ON r.departure_province_id = dp.province_id JOIN city ac 
  ON r.arrival_province_id = ac.province_id AND r.arrival_city_id = ac.city_id
  JOIN province ap ON r.arrival_province_id = ap.province_id`;
    connection.query(sql, (err, result) => {
      if (err) {
        if (!res.headersSent) {
          return res.status(500).json(err);
        }
      } else {
        if (!res.headersSent) {
          res.status(200).json(result);
        }
      }
    });
  };

  searchLocations = (req, res) => {
    const search = req.query.q;
    const sql = `SELECT city.city_id, city.city_name, province.province_id, province.name FROM city, province WHERE city.province_id = province.province_id AND (city.city_name LIKE ? OR province.name LIKE ?)`;
    const searchTerm = `%${search}%`;

    connection.query(sql, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error en la búsqueda de ubicaciones" });
      }
      res.status(200).json(results);
    });
  };

  addRoute = (req, res) => {
    console.log(req.body);

    const {
      departure_city_id,
      departure_province_id,
      arrival_city_id,
      arrival_province_id,
      text,
    } = req.body;
    if (
      departure_city_id &&
      departure_province_id &&
      arrival_city_id &&
      arrival_province_id
    ) {
      const data = [
        departure_city_id,
        departure_province_id,
        arrival_city_id,
        arrival_province_id,
        text,
      ];
      console.log(data);

      const sql = `INSERT INTO route (departure_city_id, departure_province_id, arrival_city_id, arrival_province_id, text) VALUES (?, ?, ?, ?, ?)`;

      connection.query(sql, data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error al añadir la ruta" });
        }

        const newRoute = {
          route_id: result.insertId,
          departure_city_id,
          departure_province_id,
          arrival_city_id,
          arrival_province_id,
          text,
          is_disabled: false,
        };

        res.status(200).json(newRoute);
      });
    }
  };

  //editar una ruta
  editRoute = (req, res) => {
    const {
      route_id,
      departure_province_id,
      departure_city_id,
      arrival_province_id,
      arrival_city_id,
      text,
    } = req.body;
    //validado datos de entrada
    if (
      !route_id ||
      !departure_province_id ||
      !departure_city_id ||
      !arrival_province_id ||
      !arrival_city_id
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const data = [
      departure_province_id,
      departure_city_id,
      arrival_province_id,
      arrival_city_id,
      text,
      route_id,
    ];

    const sql = `UPDATE route SET departure_province_id = ?, departure_city_id = ?, arrival_province_id = ?, arrival_city_id = ?, text = ? WHERE route_id = ?`;

    console.log(data);

    connection.query(sql, data, (err, result) => {
      if (err) {
        console.error("error en editar la ruta", err);
        return res.status(500).json({ error: "error en editar la ruta" });
      }
      res.status(200).json(result);
    });
  };

  disableRoute = (req, res) => {
    console.log(req.body);

    const { route_id, is_disabled } = req.body;

    // Validar datos de entrada
    if (!route_id || typeof is_disabled !== "boolean") {
      return res.status(400).json({
        error:
          "Todos los campos son obligatorios y 'is_disabled' debe ser booleano",
      });
    }

    const sql = `UPDATE route SET is_disabled = ? WHERE route_id = ?`;

    connection.query(sql, [is_disabled, route_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar la ruta" });
      }
      res
        .status(200)
        .json({ message: `Ruta con ID ${route_id} actualizada exitosamente` });
    });
  };

  deleteRoute = (req, res) => {
    const data = [req.params.id];

    const sql = `DELETE FROM route WHERE route_id = ?;`;

    connection.query(sql, data, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.status(200).json(result);
    });
  };

  //Rutas de Planning
  getPlanning = (req, res) => {
    const sql = `SELECT 
    planning.route_id,
    planning.planning_id,
    planning.departure_date,
    planning.departure_time,
    dp.city_name AS departure_city,
    dp_prov.name AS departure_province,
    ap.city_name AS arrival_city,
    ap_prov.name AS arrival_province
FROM planning JOIN route ON planning.route_id = route.route_id
JOIN city dp ON route.departure_city_id = dp.city_id 
AND route.departure_province_id = dp.province_id
JOIN province dp_prov ON dp.province_id = dp_prov.province_id
JOIN city ap ON route.arrival_city_id = ap.city_id AND route.arrival_province_id = ap.province_id
JOIN province ap_prov ON ap.province_id = ap_prov.province_id`;
    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  getPlanningRoutes = (req, res) => {
    const { search } = req.query;
    const sql = `SELECT 
    route.*,
    departure_city.city_name AS departure_city_name,
    departure_province.name AS departure_province_name,
    arrival_city.city_name AS arrival_city_name,
    arrival_province.name AS arrival_province_name
FROM route
JOIN city AS departure_city ON route.departure_city_id = departure_city.city_id AND route.departure_province_id = departure_city.province_id
JOIN province AS departure_province ON departure_city.province_id = departure_province.province_id
JOIN city AS arrival_city ON route.arrival_city_id = arrival_city.city_id AND route.arrival_province_id = arrival_city.province_id
JOIN province AS arrival_province ON arrival_city.province_id = arrival_province.province_id
WHERE route.is_disabled = false AND (departure_province.name LIKE '${search}%' OR departure_city.city_name LIKE '${search}%')`;
    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        console.log(result);
        res.status(200).json(result);
      }
    });
  };

  //ver usuarios
  viewUser = (req, res) => {
    const sql = `SELECT user_id, name, surname, email, phone_number, user_type, is_disabled FROM user`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.error("error en traer usuario", err);
        return res.status(500).json({ error: "error en traer usuario" });
      }
      res.status(200).json(result);
    });
  };
  //deshabilitar usuarios
  disableUser = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE user SET is_disabled = TRUE WHERE user_id = ?;`;

    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.log("error al deshabilitar usuario");
        return res
          .status(500)
          .json({ error: "Error al deshabilitar al usuario" });
      }
      res
        .status(200)
        .json({ message: `Usuario con ID ${id} está deshabilitado` });
    });
  };

  getPlanning = (req, res) => {
    const sql = `SELECT 
    planning.route_id,
    planning.planning_id,
    planning.departure_date,
    planning.departure_time,
    dp.city_name AS departure_city,
    dp_prov.name AS departure_province,
    ap.city_name AS arrival_city,
    ap_prov.name AS arrival_province
FROM planning JOIN route ON planning.route_id = route.route_id
JOIN city dp ON route.departure_city_id = dp.city_id 
AND route.departure_province_id = dp.province_id
JOIN province dp_prov ON dp.province_id = dp_prov.province_id
JOIN city ap ON route.arrival_city_id = ap.city_id AND route.arrival_province_id = ap.province_id
JOIN province ap_prov ON ap.province_id = ap_prov.province_id`;
    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  getPlanningRoutes = (req, res) => {
    const { search } = req.query;
    const sql = `SELECT 
    route.*,
    departure_city.city_name AS departure_city_name,
    departure_province.name AS departure_province_name,
    arrival_city.city_name AS arrival_city_name,
    arrival_province.name AS arrival_province_name
FROM route
JOIN city AS departure_city ON route.departure_city_id = departure_city.city_id AND route.departure_province_id = departure_city.province_id
JOIN province AS departure_province ON departure_city.province_id = departure_province.province_id
JOIN city AS arrival_city ON route.arrival_city_id = arrival_city.city_id AND route.arrival_province_id = arrival_city.province_id
JOIN province AS arrival_province ON arrival_city.province_id = arrival_province.province_id
WHERE route.is_disabled = false AND (departure_province.name LIKE '${search}%' OR departure_city.city_name LIKE '${search}%')`;
    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        console.log(result);
        res.status(200).json(result);
      }
    });
  };
}
module.exports = new AdminController();
