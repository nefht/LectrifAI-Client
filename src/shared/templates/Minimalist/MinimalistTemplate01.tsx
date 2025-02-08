import { Image, Slide, Text, Table, Shape } from "react-pptx";

function MinimalistTemplate01(data: any) {
  return [
    <Slide key={0}>
      <Text
        style={{
          x: 3,
          y: 1,
          w: 3,
          h: 0.5,
          fontSize: 32,
          bold: true,
        }}
      >
        Hello there!
      </Text>
      <Shape
        type="rect"
        style={{
          x: 3,
          y: 1.55,
          w: 3,
          h: 0.1,
          backgroundColor: "#FF0000",
        }}
      />
    </Slide>,

    <Slide key={1} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet type="bullet">Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={2}>
      <Image
        src={{
          kind: "path",
          path: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxPwqyV35kl4DIBeyxo_szC6c3VTH8IHvqCvArkFX5AzDxnaQTuA44JRBhVg0Kv17Kyb5RL2tWbRpSrhAxlnvu6Q",
        }}
        style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
      />
    </Slide>,

    <Slide key={3}>
      <Image
        src={{
          kind: "path",
          path: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxPwqyV35kl4DIBeyxo_szC6c3VTH8IHvqCvArkFX5AzDxnaQTuA44JRBhVg0Kv17Kyb5RL2tWbRpSrhAxlnvu6Q",
        }}
        style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
      />
    </Slide>,

    <Slide key={4}>
      <Image
        src={{
          kind: "path",
          path: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxPwqyV35kl4DIBeyxo_szC6c3VTH8IHvqCvArkFX5AzDxnaQTuA44JRBhVg0Kv17Kyb5RL2tWbRpSrhAxlnvu6Q",
        }}
        style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
      />
    </Slide>,

    <Slide key={5}>
      <Table
        rows={[
          [
            <Table.Cell
              colSpan={2}
              style={{
                align: "center",
                backgroundColor: "#115599",
                color: "white",
              }}
            >
              Title
            </Table.Cell>,
          ],
          [
            "foo",
            <Table.Cell style={{ align: "right", backgroundColor: "#404040" }}>
              bar
            </Table.Cell>,
          ],
          [
            <Table.Cell style={{ verticalAlign: "bottom" }}>
              what about a{" "}
              <Text.Link url="https://www.youtube.com/watch?v=6IqKEeRS90A">
                link
              </Text.Link>
            </Table.Cell>,
            "xyz",
          ],
        ]}
        style={{
          x: "10%",
          y: "10%",
          w: "80%",
          h: "80%",
          borderWidth: 4,
          borderColor: "#ff0000",
          margin: 20,
        }}
      />
    </Slide>,

    <Slide key={6}>
      <Shape
        type="rect"
        style={{
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
          backgroundColor: "#DDDDDD",
        }}
      />
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={7} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={8} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={9} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={10} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={11} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,
  ];
}

export default MinimalistTemplate01;
