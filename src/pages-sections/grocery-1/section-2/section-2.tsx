import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
// GLOBAL CUSTOM COMPONENTS
import IconComponent from "components/IconComponent";
// STYLED COMPONENT
import { ServiceCard } from "./styles";
import { getGroceryServices } from "utils/services/grocery-home";

export default async function Section2() {
  const services = await getGroceryServices();

  if (!services || !services.length) return null;

  return (
    <Container className="pt-5 pb-5 section2Wrap">
      <Grid container spacing={3}>
        {services.slice(0, 4).map(({ title, description, icon, id }) => {
          return (
            <Grid size={{ lg: 3, sm: 6, xs: 12 }} key={id}>
              <ServiceCard>
                <div className="iconBadge">
                  <IconComponent icon={icon} fontSize="large" />
                </div>

                <div className="serviceContent">
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </ServiceCard>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
